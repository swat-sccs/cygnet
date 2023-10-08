

function formatDorms(words:string) {
  /**
   * converts all uppercase form names into lowercase except for the 
   * first letter of each word in dorm name
   */
  
  let retString = "";
  let wordsarr = words.split(" ");
  for(let i = 0; i < wordsarr.length; i++) {
    let newWord = wordsarr[i][0] + wordsarr[i].substr(1, wordsarr[i].length).toLowerCase();
    retString+=(newWord + " ");
  }
  return retString.trim();
}
export default function UserInfo(props: UserInfo) {
  const { LAST_NAME, FIRST_NAME, GRAD_YEAR, DORM, DORM_ROOM, USER_ID } = props;
  return (
    <div className="mont mt-2 text-center">
        <div className="h4 mb-0">{FIRST_NAME} {LAST_NAME}</div>
        <p className="font-light mb-0">he/him</p> {/*get pronouns from where*/}
        <div className="h6 font-light mt-3">{formatDorms(DORM)} {DORM_ROOM} | {GRAD_YEAR}</div>
        <div className="h6 mt-3">{USER_ID}</div>
    </div> 
  )
}
