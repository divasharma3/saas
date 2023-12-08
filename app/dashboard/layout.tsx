import React from 'react'
import DashboardNavbar from './_components/navbar'

const Dashboardlayout = ({
    children
}:{
    children: React.ReactNode
}) => {
  return (
    <div>
        <main>
            <DashboardNavbar />
            {children}
        </main>
    </div>
  )
}

export default Dashboardlayout