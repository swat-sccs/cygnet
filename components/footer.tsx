export default function Footer() {
    return (
        <footer className="py-2 bg-white dark:bg-dark-blue footer-height flex justify-center items-center shadow">
            <div className="max-w-screen-lg h-full content-center px-2">
                <p
                    className="text-black dark:text-white text-center mb-0 text-sm"
                >
                    © 2024 Swarthmore College Computer Society |&nbsp;
                    <a className="grad hover:brightness-150 dark:brightness-150 dark:hover:brightness-100" href="https://www.sccs.swarthmore.edu/docs/policy">Usage & Data Policy</a>
                    &nbsp;| Problems with this website? Email&nbsp;
                    <a className="grad hover:brightness-150 dark:brightness-150 dark:hover:brightness-100" href="mailto:staff@sccs.swarthmore.edu">staff@sccs.swarthmore.edu</a>.
                </p>
            </div>
        </footer>
    )
}
