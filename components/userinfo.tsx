'use client'
import { StudentInfo } from "@/components/pagebody";

export default function UserInfo(props: StudentInfo | any) {

    if (!props.id) {
        return ( /* placeholder card */
            <div role="status" className="w-full mt-2 flex flex-col items-top">
                <div className="flex justify-center mb-2 gap-x-2 w-full">
                    <div className="h-5 bg-gray-200 rounded-sm dark:bg-gray-700 w-36"></div>
                    <div className="h-5 bg-gray-200 rounded-sm dark:bg-gray-700 w-36"></div>
                </div>
                
                <div className="flex justify-center mb-2 gap-x-2 w-full">
                    <div className="h-5 bg-gray-200 rounded-sm dark:bg-gray-700 w-36"></div>
                </div>

                <div className="flex justify-center mb-2 gap-x-2 w-full">
                    <div className="h-5 bg-gray-200 rounded-sm dark:bg-gray-700 w-36"></div>
                    <div className="h-5 bg-gray-200 rounded-sm dark:bg-gray-700 w-12"></div>
                    <div className="h-5 bg-gray-200 rounded-sm dark:bg-gray-700 w-12"></div>
                </div>

                <div className="flex justify-center mb-2 gap-x-2 w-full">
                    <div className="h-5 bg-gray-200 rounded-sm dark:bg-gray-700 w-36"></div>
                </div>

                <span className="sr-only">Loading...</span>
            </div>
        )
    }
    return (
        <div className="mt-2 text-center text-black dark:text-white">
            <div className="text-2xl mb-0">{props.first} {props.last}</div>
            <p className="font-light mb-0">{props.pronouns}</p>
            <div className="text-md font-light mt-3">{props.dorm} {props.room} | {props.year}</div>
            <div className="text-md font-light mt-3">{props.id}</div>
        </div>
    )
}
