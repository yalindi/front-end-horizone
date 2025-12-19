import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react"; // REMOVED: use
import { differenceInDays, addDays } from "date-fns"; // FIXED: differenceInDays

const formSchema = z
  .object({
    checkIn: z.string(),
    checkOut: z.string(),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  })
  .refine((data) => {
    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);
    const nights = differenceInDays(checkOutDate, checkInDate); // FIXED: differenceInDays
    return nights <= 30;
  }, {
    message: "Maximum stay is 30 nights",
    path: ["checkOut"],
  })
  .refine((data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison
    const checkInDate = new Date(data.checkIn);
    checkInDate.setHours(0, 0, 0, 0); // Also set check-in to midnight
    return checkInDate >= today;
  }, {
    message: "Check-in date cannot be in the past",
    path: ["checkIn"],
  });

export default function BookingForm({ onSubmit, isLoading, hotelId }) {
  const [nights, setNights] = useState(1);
  
  // Get today and tomorrow dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = addDays(today, 1);
  
  const todayString = today.toISOString().split("T")[0];
  const tomorrowString = tomorrow.toISOString().split("T")[0];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      checkIn: todayString,
      checkOut: tomorrowString,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "checkIn" || name === "checkOut") {
        const checkIn = value.checkIn ? new Date(value.checkIn) : null;
        const checkOut = value.checkOut ? new Date(value.checkOut) : null;
        
        if (checkIn && checkOut && checkOut > checkIn) {
          const diff = differenceInDays(checkOut, checkIn);
          setNights(diff);
        } else {
          setNights(1);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]); 

  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      hotelId,
      nights,
    });
  };

  const calculateMinCheckOut = () => {
    const checkInValue = form.getValues("checkIn");
    if (checkInValue) {
      const checkInDate = new Date(checkInValue);
      const nextDay = addDays(checkInDate, 1);
      return nextDay.toISOString().split("T")[0];
    } 
    return todayString;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="checkIn"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Check-in Date</FormLabel>
              <FormControl>
                <input
                  type="date"
                  className="border rounded-md px-3 py-2"
                  min={todayString}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="checkOut"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Check-out Date</FormLabel>
              <FormControl>
                <input
                  type="date"
                  className="border rounded-md px-3 py-2"
                  min={calculateMinCheckOut()} // FIXED: Added parentheses
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Add nights display for better UX */}
        <div className="bg-gray-50 p-3 rounded-md text-center">
          <p className="text-sm text-gray-600">Duration</p>
          <p className="text-lg font-semibold">
            {nights} {nights === 1 ? "night" : "nights"}
          </p>
          {nights > 30 && (
            <p className="text-red-500 text-sm mt-1">
              Maximum stay is 30 nights
            </p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? "Booking..." : `Book for ${nights} nights`}
        </Button>
        
        {/* Show form-level errors if any */}
        {form.formState.errors.root && (
          <p className="text-red-600 text-sm text-center">
            {form.formState.errors.root.message}
          </p>
        )}
      </form>
    </Form>
  );
}