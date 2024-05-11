import magnifyingGlassImage from "@/pages/AddPhoneNumber/images/magnifying_glass.svg";
import Image from "@/components/ui/Image.tsx";

interface CountriesSearchBarProps {
    search: string;
    setSearch: (value: string) => void;
}

export default function CountriesSearchBar({ search, setSearch }: CountriesSearchBarProps) {
    return (
        <div
            className="bg-white p-1.5 border border-neutral-300 rounded-md flex items-center 
        space-x-1.5"
        >
            <div className="bg-neutral-100 w-10 h-full p-1.5 rounded-md">
                <Image className="w-6 h-6" src={magnifyingGlassImage} alt="magnifyingGlass" />
            </div>
            <div className="bg-neutral-100 h-full p-1.5 rounded-md flex-1">
                <input
                    className="ml-1 outline-none w-full bg-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
    );
}
