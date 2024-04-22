"use client"
import { useState } from "react";
import { StudentInfo } from "./pagebody";
import Card from "./card";
import BadWordsNext from 'bad-words-next'
import en from 'bad-words-next/data/en.json'

export default function SettingsForm({ inData }: { inData: StudentInfo }) {
  const badwords = new BadWordsNext({ data: en })
  const [userData, setUserData] = useState(inData);
  return (
    <div className="row container-fluid mx-auto">
      <div className="col-12 col-md-3 h-100 w-full">
        <Card {...userData} />
      </div>
      <div className="col-12 mt-2 col-md-9 h-full bg-white pt-3 pb-2 px-4 shadow-sm rounded-lg mont">
        <h1 className="h4 text-center">Edit Profile</h1>
        <div className="md-d-inline-flex w-75 mx-auto mt-3">
          <div className="w-full p-2">
            <label className="h6 d-block text-center">First Name</label>
            <input
              name="fName"
              className="py-1 px-2 w-full d-block"
              value={userData.first}
              onChange={(e) =>
                {
                  if (badwords.check(e.target.value)) {
                    alert('bad ')
                  } else {
                    setUserData(
                      Object.assign({}, userData, { first: e.target.value })
                    )
                  }
                }
              }
            />
          </div>
          <div className="w-full p-2">
            <label className="h6 d-block text-center">Last Name</label>
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
          <div className="w-full p-2 text-center">
            <label className="h6 d-block">Pronouns</label>
            <input
              name="pNouns"
              className="py-1 px-2 w-full d-block"
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
            name="showDorm"
            checked={userData.showDorm}
            onChange={(e) =>
              setUserData(
                Object.assign({}, userData, { showDorm: !(userData.showDorm) })
              )
            }
          />
          <label className="mont">Show Dorm</label>
        </div>
        <div className="form-check form-switch mt-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="showPicture"
            checked={userData.showPicture}
            onChange={(e) =>
              setUserData(
                Object.assign({}, userData, { showPicture: !(userData.showPicture) })
              )
            }
          />
          <label className="mont">Show Picture</label>
        </div>
        <div className="form-check form-switch mt-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="showProfile"
            checked={userData.showProfile}
            onChange={(e) =>
              setUserData(
                Object.assign({}, userData, { showProfile: !(userData.showProfile) })
              )
            }
          />
          <label className="mont">Show Profile</label>
        </div>
        <input type="submit" value="Submit" className="m-2 mx-auto w-full"/>
      </div>
    </div>
  );
}
