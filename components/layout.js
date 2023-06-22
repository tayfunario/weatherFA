import React from 'react'

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-800 to-gray-800">
            <main>{children}</main>
        </div>
    )
}
