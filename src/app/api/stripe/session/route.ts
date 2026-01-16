import { NextRequest, NextResponse } from "next/server";
import { authOptions, CustomSession } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db.config";
import { Stripe } from "stripe";

interface SessionPayload {
  plan: string;
}

export async function POST(req: NextRequest) {
  const session: CustomSession | null = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
  }
  try {
    const body: SessionPayload = await req.json();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    // * Get Product
    const product = await prisma.products.findUnique({
      where: {
        name: body.plan,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "No product found.please check you passed correct product" },
        { status: 404 }
      );
    }

    // * Create Transaction
    const transaction = await prisma.transaction.create({
      data: {
        user_id: Number(session?.user?.id!),
        amount: product.amount,
      },
    });

    // * Create Stripe Session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      currency: "INR",
      billing_address_collection: "required",
      line_items: [
        {
          price: product?.price_id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.nextUrl.origin}/payment/success?txnId=${transaction.id}`,
      cancel_url: `${req.nextUrl.origin}/payment/cancel?txnId=${transaction.id}`,
    });

    return NextResponse.json({
      message: "Session generated successfully!",
      id: stripeSession?.id,
      url: stripeSession?.url,
    });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    
    // Check if it's a Prisma connection error
    if (error instanceof Error && error.message.includes("timeout")) {
      return NextResponse.json(
        { message: "Database connection timeout. Please try again." },
        { status: 503 }
      );
    }
    
    // Check if it's a Stripe error
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { message: `Payment error: ${error.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "Something went wrong. Please try again!" },
      { status: 500 }
    );
  }
}