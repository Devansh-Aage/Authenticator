import { type FC } from 'react'
import { Link } from 'react-router'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

interface NavbarProps {

}

const Navbar: FC<NavbarProps> = ({ }) => {
    // const { connected, publicKey } = useWallet();
    return (
        <div className='w-full flex items-center justify-between pr-5'>
            <div className='bg-gradient-to-b px-10 from-slate-500 to-transparent h-16 w-[50%] rounded-2xl  mx-auto flex items-center justify-between'>
                <p className='text-xl font-semibold'>Academia Authenticator</p>
                <div className='flex items-center gap-5'>
                    <Link className='font-bold hover:text-zinc-700 transition-all duration-200' to={'/'}>Authenticate</Link>
                    <Link className='font-bold hover:text-zinc-700 transition-all duration-200' to={'/mint'}>Mint</Link>

                </div>
            </div>
            <WalletMultiButton />
        </div>
    )
}

export default Navbar