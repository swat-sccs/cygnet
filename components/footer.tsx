import packageInfo from '../package.json';

export default function Footer() {
    return (
        <footer className="border-t border-line bg-bg py-6">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-fg-3">
                <p className="m-0">
                    © 2026 Swarthmore College Computer Society · v{packageInfo.version}
                </p>
                <nav aria-label="Footer" className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
                    <a
                        className="text-fg-2 hover:text-fg underline-offset-4 hover:underline transition-colors duration-150"
                        href="https://www.sccs.swarthmore.edu/docs/policy"
                    >
                        Usage &amp; Data Policy
                    </a>
                    <a
                        className="text-fg-2 hover:text-fg underline-offset-4 hover:underline transition-colors duration-150"
                        href="mailto:staff@sccs.swarthmore.edu"
                    >
                        staff@sccs.swarthmore.edu
                    </a>
                </nav>
            </div>
        </footer>
    )
}
