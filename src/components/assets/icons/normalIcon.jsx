import { ListItemPrefix } from "@material-tailwind/react";

export default function NormalIcon() {
    return (
        <ListItemPrefix>
            <svg
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="currentColor"
                className="h-5 w-5"
            >
                <path
                    d="M19 7V5L5 5V7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></path>
                <path
                    d="M12 5L12 19M12 19H10M12 19H14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></path>
            </svg>
        </ListItemPrefix>
    )
}
