import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { set, z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateHotelMutation } from "@/lib/api";
import { Textarea } from "./ui/textarea";
import {useState} from 'react'
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react";
import { DevTool } from "@hookform/devtools";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  image: z.string().min(1, {
    message: "Image is required",
  }),
  location: z.string().min(1, {
    message: "Location is required",
  }),
  price: z.number().nonnegative({
    message: "Price is required",
  }),
});

export default function HotelCreateForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      location: "",
      price: 0,
    },
  });

  const [createHotel, { isLoading }] = useCreateHotelMutation();

  async function onSubmit(values) {
    setErrorMessage(null);
    setIsSuccess(false);

    try {
      await createHotel(values).unwrap();
      setIsSuccess(true);
      form.reset();
      setTimeout(() => {setIsSuccess(false);},3000)
    } catch (error) {
      console.error(error);
      setErrorMessage(error.data?.message || "Failed to create hotel.Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 w-1/4 flex flex-col gap-4"
      >
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle className="ml-2">Error</AlertTitle> 
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        {isSuccess && (
          <Alert className="mb-4">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Hotel created successfully.</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Hotel Name" {...field} />
              </FormControl>
              <FormDescription>This is the name of the hotel.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Hotel description" {...field} />
              </FormControl>
              <FormDescription>
                A short description of the hotel.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input placeholder="Image URL" {...field} />
              </FormControl>
              <FormDescription>URL to an image of the hotel.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="City, Country" {...field} />
              </FormControl>
              <FormDescription>Where is the hotel located?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="100"
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (isNaN(val)) {
                      field.onChange(0);
                    } else {
                      field.onChange(val);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>Price per night in USD.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Hotel"}
        </Button>
        <DevTool control={form.control} />
      </form>
    </Form>
  );
}