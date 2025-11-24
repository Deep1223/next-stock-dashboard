'use client';

import { useEffect } from 'react';
import MasterJson from '@/config/masterJSON';
import IISMethods from '@/utils/IISMethods';
import { setProps } from '@/utils/reduxUtils';
import StockHistoryController from '@/app/controller/StockHistoryController';

const StockHistory = (props) => {

    useEffect(() => {
        const fetchData = async () => {
            const data = MasterJson('stockhistory')

            await setProps({ rightsidebarformdata: IISMethods.getcopy(data) })
        }
        fetchData();
    }, []);

    try {
        return (
            <>
                <StockHistoryController />
            </>
        );
    }
    catch (e) {
        console.log('error', e);
        return <></>;
    }
};

export default StockHistory;