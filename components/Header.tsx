import { SendHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className='flex items-center justify-center flex-col gap-2 pt-[100px] px-4'>
        <h1 className="text-4xl lg:text-6xl font-black">
            Latest Blog
        </h1>
        <p className="text-md md:text-lg lg:text-xl">
            Blog with Next JS 15 & MongoDB
        </p>

        <form action="" className="flex items-center gap-2">
            <Input type='email' id='newsletter' name='newsletter' placeholder='Enter your emial' className='bg-white'>
            </Input>
            <Button className='bg-blue-600 hover:bg-blue-500 my-4 shadow-lg animate-bounce'>
                <SendHorizontal />
            </Button>
        </form>
    </header>
  )
}
