const Footer = () => {
    try {
        return (
            <footer className="bg-white text-gray-700 text-center py-3 text-sm w-full shadow-[0_-2px_6px_rgba(0,0,0,0.05)] border-t border-gray-300">
                © Copyright <span className="font-bold">CRM</span>. All Rights Reserved
            </footer>
        );
    } catch (e) {
        console.log(e);
        return <></>;
    }
}

export default Footer;