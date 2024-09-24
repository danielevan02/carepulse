import {DataTable} from '@/components/table/DataTable'
import {columns} from '@/components/table/columns'
import StatCard from '@/components/ui/StatCard'
import { getRecentAppointmentList } from '@/lib/actions/appointment.action'
import { revalidatePath } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Admin = async () => {
	const appointments = await getRecentAppointmentList()
	revalidatePath('/admin')
  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
      <header className='admin-header'>
				<Link href={"/"} className='cursor-pointer'>
					<Image 
						src='/assets/icons/logo-full.svg'
						height={32}
						width={162}
						alt='logo'
						className='h-8 w-fit'
					/>
				</Link>
				<p className='text-16-semibold'>Admin Dashboard</p>
			</header>

			<main className='admin-main'>
				<section className='w-full space-y-4'>
					<h1 className='header'>Welcome 👋</h1>
					<p className='text-dark-700'>Start the day with managing new appointments</p>
				</section>
				<section className='admin-stat'>
					<StatCard type='appointments' count={appointments.scheduledCount} label="Scheduled Appointments" icon="/assets/icons/appointments.svg" />
					<StatCard type='pending' count={appointments.pendingCount} label="Pending Appointments" icon="/assets/icons/pending.svg" />
					<StatCard type='cancelled' count={appointments.cancelledCount} label="Cancelled Appointments" icon="/assets/icons/cancelled.svg" />
				</section>

				<DataTable data={appointments.documents} columns={columns} />

			</main>

    </div>
  )
}

export default Admin