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
    }, [searchQuery, form])

    function onSubmit(values) {
        dispatch(setQuery(values.query));
    }

    function handleClearSearch() {
        dispatch(resetQuery());
        form.reset()
        inputRef.current?.focus();
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape' && searchQuery) {
            handleClearSearch()
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.handleSubmit(onSubmit)()
        }
    }

    const hasSearchQuery = Boolean(searchQuery)
    const currentQuery = form.getValues('query')

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
                                            className="bg-[#1a1a1a] text-sm sm:text-base text-white placeholder:text-white/70 border-0 rounded-full py-6 pl-4 pr-12 sm:pr-32 w-full transition-all focus:ring-2 focus:ring-white/50"
                                            onKeyDown={handleKeyDown}
                                            {...field}
                                            value={currentQuery || ''}
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
                            className="absolute right-28 h-[70%] my-auto bg-white/10 hover:bg-white/20 text-white rounded-full px-3 flex items-center gap-x-2 transition-colors z-10"
                            variant="ghost"
                            size="sm"
                        >
                            <X className="w-4 h-4" />
                            <span className="text-xs hidden sm:inline">Clear</span>
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={!currentQuery.trim()}
                        className={`absolute right-2 h-[70%] my-auto rounded-full px-3 sm:px-4 flex items-center gap-x-2 transition-colors${!currentQuery.trim() ? 'bg-white text-black hover:bg-white/90' : 'bg-white/20 text-white/50 cursor-not-allowed'}`}
                    >
                        <Sparkle className="w-4 h-4" />
                        <span className="text-sm">AI Search</span>
                    </Button>
                </div>
                {currentValue && (
                    <div className="mt-2 text-xs text-white/60 px-4">
                        {currentValue.length > 200 && (
                            <span className="text-yellow-500">
                                Query is getting long. Try to be concise.
                            </span>
                        )}
                        {form.formState.errors.query && (
                            <span className="text-red-400">
                                {form.formState.errors.query.message}
                            </span>
                        )}
                    </div>
                )}

            </form>
        </Form>
    );
}



