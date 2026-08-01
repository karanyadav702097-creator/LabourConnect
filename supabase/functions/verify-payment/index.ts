import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import crypto from "https://deno.land/std@0.168.0/node/crypto.ts"

const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')

serve(async (req) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = await req.json()

    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 })
    }

    // 2. Update Booking Status
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error } = await supabase
      .from('bookings')
      .update({ payment_status: 'paid', status: 'accepted' })
      .eq('id', booking_id)

    if (error) throw error

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
