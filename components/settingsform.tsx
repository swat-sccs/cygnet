"use client";

import { useState } from "react";
import { StudentInfo } from "./pagebody";
import Card from "./card";

export default function SettingsForm({ inData }: { inData: StudentInfo }) {
  const [userData, setUserData] = useState(inData);
  return (
    <div className="row">
      <div className="col-12 col-md-3 h-100 w-full">
        <Card {...userData} />
      </div>
      <div className="col-12 col-md-9 h-full bg-white pt-3 pb-2 px-4 shadow-sm rounded-lg mont">
        <h1 className="h4">Edit Profile</h1>
        <div className="d-inline-flex w-75 mt-3">
          <div className="w-full mr-2">
            <label className="h6 d-block">First Name</label>
            <input
              name="fName"
              className="py-1 px-2 w-full d-block"
              value={userData.first}
              onChange={(e) =>
                setUserData(
                  Object.assign({}, userData, { first: e.target.value })
                )
              }
            />
          </div>
          <div className="w-full ml-2">
            <label className="h6 d-block">Last Name</label>
            <input
              name="lName"
              className="py-1 px-2 w-full d-block"
              value={userData.last}
              onChange={(e) =>
                setUserData(
                  Object.assign({}, userData, { last: e.target.value })
                )
              }
            />
          </div>
          <div className="w-full ml-2">
            <label className="h6 d-block">Pronouns</label>
            <input
              name="pNouns"
              className="py-1 px-2 w-75 d-block"
              value={userData.pronouns}
              onChange={(e) =>
                setUserData(
                  Object.assign({}, userData, { pronouns: e.target.value })
                )
              }
            />
          </div>
        </div>
        <div className="form-check form-switch mt-4">
          <input
            className="form-check-input"
            type="checkbox"
            name="showPicture"
          />
          <label className="mont">Show Dorm</label>
        </div>
        <div className="form-check form-switch mt-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="showPicture"
          />
          <label className="mont">Show Picture</label>
        </div>
        <div className="form-check form-switch mt-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="showPicture"
          />
          <label className="mont">Show Profile</label>
        </div>
        <input type="submit" value="Submit" />
      </div>
    </div>
  );
}
