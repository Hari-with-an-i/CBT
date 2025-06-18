import { useState } from 'react'
import '../index.css'
import Logo from '../assets/LogoWhite.png'

export default function Navbar() {
    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            alt=""
                            src={Logo}
                            className="h-25 w-auto"
                        />
                    </a>
                </div>
            </nav>
        </header>
    )
}