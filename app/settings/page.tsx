'use client'
import Card from '@/components/card';
import { StudentInfo } from '../page';
import 'bootstrap/dist/css/bootstrap.css';

// will need to be loaded from our own database eventually, 
// just UI functional for now

const user_data:StudentInfo = {
    "LAST_NAME": "Fettig",
    "FIRST_NAME": "Nicholas",
    "GRAD_YEAR": "2026",
    "DORM": "MERTZ",
    "DORM_ROOM": "125",
    USER_ID: '',
    PHOTO: [] //not permanent, will be loaded in 
}

export default function Settings(){
    return (
        <div className="d-inline-flex w-full margin-spacing">
            <div className="w-25">
                <Card {...user_data} />
            </div>
            <div className="flex-grow-1 bg-white p-4 shadow-sm ml-2 rounded-lg mont">
                <h1 className="h4">Edit Profile</h1>
                <div className="d-inline-flex w-75 mt-3">
                    <div className="w-full mr-2">
                        <label className="h6 d-block">First Name</label>
                        <input 
                        className = "py-1 px-2 w-full d-block"
                        placeholder={user_data.FIRST_NAME} />
                    </div>
                    <div className="w-full ml-2">
                        <label className="h6 d-block">Last Name</label>
                        <input 
                        className = "py-1 px-2 w-full d-block"
                        placeholder={user_data.LAST_NAME} />
                    </div>
                    <div className="w-full ml-2">
                        <label className="h6 d-block">Pronouns</label>
                        <input 
                        className = "py-1 px-2 w-75 d-block" 
                        placeholder={""/*prounouns will go in here eventually*/} />
                    </div>
                </div>
                <div className="form-check form-switch mt-4">
                    <input className="form-check-input" type="checkbox"/>
                    <label className="mont">Show Dorm</label>
                </div>
                <div className="form-check form-switch mt-3">
                    <input className="form-check-input" type="checkbox"/>
                    <label className="mont">Show Picture</label>
                </div>
                <div className="form-check form-switch mt-3">
                    <input className="form-check-input" type="checkbox"/>
                    <label className="mont">Show Profile</label>
                </div>
            </div>
        </div>
    )
}