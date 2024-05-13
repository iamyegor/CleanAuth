import Country from "@/pages/AddPhoneNumber/types/Country.ts";
import { useEffect } from "react";
import countries from "@/pages/AddPhoneNumber/data/countries.ts";

export default function useSearchCountries(
    search: string,
    setCountries: (countries: Country[]) => void,
) {
    useEffect(() => {
        setCountries(countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())));
    }, [search]);
}
