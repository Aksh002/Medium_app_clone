import { Link } from "react-router-dom"

export const BottomBar=()=>{
    return <div>
        <div className="pt-4 pb-4 mt-4 border-t-2 border-gray-300">
            <div className="flex justify-center">
                <div className="flex justify-center space-x-3 sm:space-x-6 text-sm font-mono font-extralight text-gray-400">
                    <Link to={'/'}><div className="hover:text-gray-600 hidden sm:block">Help</div></Link>
                    <Link to={'/'}><div className="hover:text-gray-600">Terms</div></Link>
                    <Link to={'/'}><div className="hover:text-gray-600 hidden sm:block">Status</div></Link>
                    <Link to={'/'}><div className="hover:text-gray-600">Contact Us</div></Link>
                    <Link to={'/'}><div className="hover:text-gray-600 hidden sm:block">Career</div></Link>
                    <Link to={'/'}><div className="hover:text-gray-600">Built By</div></Link>
                    <Link to={'/'}><div className="hover:text-gray-600 hidden sm:block">Press</div></Link>
                    <Link to={'/'}><div className="hover:text-gray-600">About</div></Link>
                    <Link to={'/'}><div className="hover:text-gray-600 hidden sm:block">Privacy</div></Link>
                    <Link to={'/'}><div className="hover:text-gray-600">Blogs</div></Link>
                </div>
            </div>
        </div>
    </div>
}