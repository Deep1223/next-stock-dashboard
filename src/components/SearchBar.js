import { useState, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

const SearchBar = (props) => {
    const [inputValue, setInputValue] = useState(props.searchTerm);

    const triggerSearch = () => {
        props.handleSearch(inputValue.trim());
    };

    useEffect(() => {
        props.handleSearch("")
    }, [inputValue === '']);

    try {
        return (
            <div className="relative w-full max-w-xs">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
                    placeholder="Search..."
                    className="border w-full pl-10 pr-10 py-2 rounded-md text-sm focus:outline-none focus:ring focus:border-blue-300"
                />

                <BiSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg cursor-pointer"
                    onClick={triggerSearch}
                />

                {inputValue && (
                    <IoClose
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg cursor-pointer"
                        onClick={() => {
                            setInputValue("");
                            props.setSearchTerm("");
                            props.handleSearch("");
                        }}
                    />
                )}
            </div>
        );
    }
    catch (e) {
        console.log(e);
        return <></>;
    }
};

export default SearchBar;
