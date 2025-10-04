// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { Button } from "@/components/ui/button";
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useGetHotelBySearchQuery } from "@/lib/api";

// import { DevTool } from "@hookform/devtools";
// import { Sparkle } from "lucide-react";

// const aiSearchFormSchema = z.object({
//     query: z.string().min(1, {
//         message: "Query is required",
//     }),
// });

// export default function AISearch() {
//     const form = useForm({
//         resolver: zodResolver(aiSearchFormSchema),
//         defaultValues: {
//             query: "",
//         },
//     });
//     const [SearchHotels, { isLoading }] = useGetHotelBySearchQuery();
//     // 2. Define a submit handler.
//     async function onSubmit(values) {
//         // Do something with the form values.
//         // ✅ This will be type-safe and validated.
//         try {
//             await SearchHotels(values).unwrap();
//         } catch (error) {
//             console.error(error);
//         }
//     }
//     return (
//         <Form {...form}>
//             <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="w-full max-w-md"
//             >
//             <div className="relative flex items-center">
//                 <div className="relative flex-grow">
//                 <FormField
//                     control={form.control}
//                     name="query"
//                     render={({ field }) => (
//                         <FormItem className="w-full">
//                             <FormControl>
//                                 <Input placeholder="Search..."
//                                 className="bg-[#1a1a1a] text-sm sm:text-base text-white placeholder:text-white/70 placeholder:text-sm sm:placeholder:text-base sm:placeholder:content-['Describe_your_destination...'] border-0 rounded-full py-6 pl-4 pr-12 sm:pr-32 w-full transition-all"
//                                  {...field} />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 </div>
//                 <Button type="submit"
//                 disabled={isLoading}
//                 className="absolute right-2 h-[80%] my-auto bg-black text-white rounded-full px-2 sm:px-4 flex items-center gap-x-2 border-white border-2 hover:bg-white/10 transition-colors">
//                     <Sparkle className="w-4 h-4 fill-white"/>
//                     <span className="text-sm">AI Search</span>
//                 </Button>
//             </div>
//                 <DevTool control={form.control} />
//             </form>
//         </Form>
//     );




// }

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setQuery } from "@/lib/features/searchSlice";
import { Sparkle } from "lucide-react";

const aiSearchFormSchema = z.object({
    query: z.string()

});

export default function AISearch() {
    const dispatch = useDispatch();
    const form = useForm({
        resolver: zodResolver(aiSearchFormSchema),
        defaultValues: {
            query: "",
        },
    });

    function onSubmit(values) {
        // Dispatch the query to Redux store instead of calling API directly
        dispatch(setQuery(values.query));
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-md"
            >
                <div className="relative flex items-center">
                    <div className="relative flex-grow">
                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input 
                                            placeholder="Search for the experience you want"
                                            className="bg-[#1a1a1a] text-sm sm:text-base text-white placeholder:text-white/70 placeholder:text-sm sm:placeholder:text-base sm:placeholder:content-['Describe_your_destination...'] border-0 rounded-full py-6 pl-4 pr-12 sm:pr-32 w-full transition-all"
                                            {...field} 
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button 
                        type="submit"  
                        className="absolute right-2 h-[80%] my-auto bg-black text-white rounded-full px-2 sm:px-4 flex items-center gap-x-2 border-white border-2 hover:bg-white/10 transition-colors"
                    >
                        <Sparkle className="w-4 h-4 fill-white"/>
                        <span className="text-sm">AI Search</span>
                    </Button>
                </div>
            </form>
        </Form>
    );
}



