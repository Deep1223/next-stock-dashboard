const Footer = () => {
    try {
        return (
            <footer className="bg-white text-gray-700 text-center py-3 text-sm w-full shadow-md">
                © Copyright <span className="font-bold">CRM</span>. All Rights Reserved
            </footer>
        );
    } catch (e) {
        console.log(e);
        return <></>;
    }
}

export default Footer;