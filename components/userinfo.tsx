interface UserInfo {
  FIRST_NAME: string;
  LAST_NAME: string;
  GRAD_YEAR: string;
  DORM: string;
  DORM_ROOM: string;
  EMAIL_ADDRESS: string;
}

export default function UserInfo(props: UserInfo) {
  const { LAST_NAME, FIRST_NAME, GRAD_YEAR, DORM, DORM_ROOM, EMAIL_ADDRESS } = props;
  return (
    <div className="mont mt-3 text-center">
        <div className="h4 mb-0">{FIRST_NAME} {LAST_NAME}</div>
        <div className="h6 font-light mb-0">{DORM} {DORM_ROOM}</div>
        <div className="h6 font-light mb-0">{GRAD_YEAR}, {EMAIL_ADDRESS}</div>
        <div className="h6 font-light mb-0">he/him</div>
    </div> 
  )
}
