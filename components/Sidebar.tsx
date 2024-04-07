'use client';

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react'
import {motion} from 'framer-motion'

const Sidebar = () => {
    const pathname = usePathname();
  return (
    <section className='sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]'>
        <div className='flex flex-1 flex-col gap-6'>
            {sidebarLinks.map((link) => {
                const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`);
                return (
                    <Link href={link.route} key={link.label} className={cn('flex gap-4 items-center p-4 rounded-lg justify-start hover:bg-sky-4',{'bg-blue-1': isActive})}>
                        <motion.div className='flex gap-4' whileHover={{scale: 1.055,transition: { duration: 0.3 },}}>
                            <Image src={link.imgUrl} alt={link.label} width={24} height={24}/>
                            <p className='text-lg font-semibold max-lg:hidden hover:text-sky-2'>{link.label}</p>
                        </motion.div>
                    </Link>
                )
            })}
        </div>
    </section>
  )
}

export default Sidebar