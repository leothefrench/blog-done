import Logo from '@/public/logo-246.svg'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import Link from 'next/link'
import Image from 'next/image'
import { Menu, MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const links = [
    {href: '/', label: 'Home'},
    {href: '/blog', label: 'Blog'},
]

export const Nav = () => {
  return (
    <nav className='flex justify-between items-center py-5 px-6 border-b'>
        <Link  href='/'>
            <Image
                src={Logo}
                width={30}
                height={30}
                alt='logo'
            />
        </Link>
        <div className="hidden md:flex justify-center items-center gap-4 text-sm">
            {links.map((link, index) => (
                <Link href={link.href} key={index} className='hover:text-blue-600'>
                    {link.label}
                </Link>
                )
            )}
             <Button className='bg-blue-600 hover:bg-blue-500 my-4 shadow-lg group'>
                <Link href='/blog/add' className='flex items-center gap-2'>
                    <span>Get Stared</span>
                    <MoveRight className='hidden group-hover:block'/>
                </Link>
            </Button>
        </div>
        <Sheet>
            <SheetTrigger className='md:hidden'>
                <Menu />
            </SheetTrigger>
            <SheetContent  aria-labelledby="sheet-title">
                <SheetHeader>
                <SheetTitle id="sheet-title">Navigation</SheetTitle>
                <div className="flex flex-col gap-4 text-sm text-left">
                    <Button className='bg-blue-600 hover:bg-blue-500 my-4 shadow-lg group'>
                        <Link href='/blog/add' className='flex items-center gap-2'>
                            <span>Get Stared</span>
                            <MoveRight className='hidden group-hover:block'/>
                        </Link>
                    </Button>
                    {links.map((link, index) => (
                    <Link href={link.href} key={index} className='hover:text-blue-600 border-l-2 hover:border-l-blue-600 transition-all pl-2'>
                        {link.label}
                    </Link>
                         )
                    )}
                </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    </nav>
  )
}
