import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setQuery, resetQuery } from "@/lib/features/searchSlice";
import { Sparkle, X } from "lucide-react";

const aiSearchFormSchema = z.object({
    query: z.string()

});

export default function AISearch() {
    const dispatch = useDispatch();
    const searchQuery = useSelector((state) => state.search.query)
    const form = useForm({
        resolver: zodResolver(aiSearchFormSchema),
        defaultValues: {
            query: "",
        },
    });

    useEffect(() => {
        if (form.getValues('query') !== searchQuery) {
            form.setValue('query', searchQuery || '')
        }
    }, [searchQuery, form])

    function onSubmit(values) {
        dispatch(setQuery(values.query));
    }

    function handleClearSearch(){
        dispatch(resetQuery());
        form.reset()
    }

    function handleKeyDown(e){
        if (e.key=== 'Escape' && searchQuery){
            handleClearSearch()
        }
    }

    const hasSearchQuery=Boolean(searchQuery)

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
                    {hasSearchQuery && (
                        <Button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-32 h-[80%] my-auto bg-black text-white rounded-full px-2 flex items-center gap-x-2 border-white border hover:bg-white/10 transition-colors"
                            variant="ghost"
                            size="sm"
                        >
                            <X className="w-4 h-4" />
                            <span className="text-xs hidden sm:inline">Clear</span>
                        </Button>
                    )}
                    <Button
                        type="submit"
                        className="absolute right-2 h-[80%] my-auto bg-black text-white rounded-full px-2 sm:px-4 flex items-center gap-x-2 border-white border-2 hover:bg-white/10 transition-colors"
                    >
                        <Sparkle className="w-4 h-4 fill-white" />
                        <span className="text-sm">AI Search</span>
                    </Button>
                </div>
            </form>
        </Form>
    );
}



