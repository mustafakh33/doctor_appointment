import { redirect } from "next/navigation";

export default function MyBookingPage() {
  redirect("/dashboard?tab=bookings");
}
