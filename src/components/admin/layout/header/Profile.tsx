'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import SimpleBar from 'simplebar-react'
import { profileDD } from './data'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type Props = {
  fullName: string;
  email: string;
};

const Profile = ({ fullName, email }: Props) => {
  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className='relative group/menu ps-15 shrink-0'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className='hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary'>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-screen sm:w-[220px] pb-4 pt-2 rounded-sm'>
          <div className="px-4 py-2">
            <p className="text-sm font-semibold">{fullName}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
          <DropdownMenuSeparator className='my-2' />
          <SimpleBar>
            {profileDD.map((item) => (
              <DropdownMenuItem key={item.url} asChild>
                <Link
                  href={item.url}
                  className='px-4 py-2 flex items-center gap-3 w-full hover:bg-lightprimary hover:text-primary'>
                  <Icon icon={item.icon} className='text-lg text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>{item.title}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </SimpleBar>

          <DropdownMenuSeparator className='my-2' />

          <div className='px-4'>
            <form action="/auth/signout" method="post">
              <Button type="submit" variant='outline' className='w-full rounded-md'>
                Déconnexion
              </Button>
            </form>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default Profile
