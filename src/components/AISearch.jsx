import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";

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
    const searchQuery = useSelector((state) => state.search.query);
    const inputRef = useRef(null);
    
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
    }, [searchQuery, form]);

    function onSubmit(values) {
        dispatch(setQuery(values.query));
    }

    function handleClearSearch(){
        dispatch(resetQuery());
        form.reset();
        inputRef.current?.focus();
    }

    function handleKeyDown(e){
        if (e.key === 'Escape' && searchQuery){
            handleClearSearch();
        }
    }

    const hasSearchQuery = Boolean(searchQuery);
    const formQueryValue = form.getValues('query'); 

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
                                            ref={inputRef}
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
                        disabled={!formQueryValue?.trim()}
                        className={`absolute right-2 h-[80%] my-auto rounded-full px-2 sm:px-4 flex items-center gap-x-2 transition-colors ${
                            formQueryValue?.trim() 
                                ? 'bg-black text-white hover:bg-white/10 border-white border-2' 
                                : 'bg-white/20 text-white/50 cursor-not-allowed border-white/20 border-2'
                        }`}
                    >
                        <Sparkle className="w-4 h-4" />
                        <span className="text-sm">AI Search</span>
                    </Button>
                </div>
            </form>
        </Form>
    );
}