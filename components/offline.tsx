export default function Offline() {
  return (
    <div className="dark:text-white w-[50%] justify-self-center mt-72 align-middle  items-center justify-center bg-white dark:bg-dark-blue rounded-lg py-6 px-3 cont shadow-md grow h-full md:transform md:transition  md:hover:shadow-lg ">
      <h2 className="text-center">
        Due to recent changes in how student data is managed at Swarthmore, we
        are working closely with ITS and the administration to determine the
        future of Cygnet.
      </h2>
      <h5 className="mt-5 text-center">
        We will share updates as they become available. In the meantime, stay
        connected with us at{" "}
        <a
          href="https://www.instagram.com/swatsccs/"
          className="underline  text-orange-500"
        >
          @swatsccs
        </a>{" "}
        and explore some of our other services, such as:
        <ul className="mt-10">
          <li>
            <a
              href="https://plan.sccs.swarthmore.edu/"
              className="underline  text-orange-500"
            >
              Course Planner
            </a>
          </li>
          <li>
            <a
              href="https://gpacalc.sccs.swarthmore.edu/"
              className="underline  text-orange-500"
            >
              GPA Calculator
            </a>
          </li>
          <li>
            <a
              href="https://rsd.sccs.swarthmore.edu/"
              className="underline text-orange-500"
            >
              RSD
            </a>
          </li>
          <li>
            <a
              href="https://chromewebstore.google.com/detail/swat-dining/hljemhgbbhjcmclhbdlalcoljlmjidll?hl=en&pli=1"
              className="underline  text-orange-500"
            >
              Dining Hall Chrome Extension
            </a>
          </li>
        </ul>
      </h5>
    </div>
  );
}
