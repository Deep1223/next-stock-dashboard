'use client';

import { useEffect } from 'react';
import IISMethods from '@/utils/IISMethods';
import { setProps, getCurrentState, getSortData, clearData } from '@/utils/reduxUtils';
import MasterView from '@/app/common/MasterView';
import { useAppSelector } from '@/store/hooks';
import JsCall from '@/utils/JsCall';
import Config from '@/config/config';
import ApiService from '@/utils/ApiService';

const StockHistoryController = (props) => {
    const rightSidebarData = useAppSelector(state => state.rightsidebarformdata);
    const formData = useAppSelector(state => state.formdata);
    const filterData = useAppSelector(state => state.filterdata);
    const pagelimit = useAppSelector(state => state.pagelimit);
    const pageno = useAppSelector(state => state.pageno);
    const nextpage = useAppSelector(state => state.nextpage);
    const totalcount = useAppSelector(state => state.totalcount);

    // ✅ Initialize state and load data on mount
    useEffect(() => {
        console.log('🔄 StockHistoryController mounted - Initializing...');

        setProps({
            data: [],
            formData: {},
            filterData: {},
            masterdata: [],
            masterdatalist: [],
            modal: [],
            pageno: 1,
            pagename: '',
            nextpage: 0,
            totalcount: 0,
            pagelimit: 20,
            sortdata: { field: 'id', order: -1 },
        });
    }, []); // Empty dependency array - runs once on mount

    // ✅ Update pagename when rightSidebarData changes
    useEffect(() => {
        const pagename = rightSidebarData?.[0]?.pagename || '';
        const listData = async (pagename) => {
            clearData();
            console.log('Setting pagename:', pagename);
            setProps({ pagename });

            await getlist();
        }

        if (pagename) {
            listData(pagename);
        }
    }, [rightSidebarData]);

    const printSelectPicker = (item, fields) => {
        return item[fields.masterdatafield]
    }

    const getMasterData = async (page, fields) => {
        const staticfilter = fields.staticfilter || {};

        let projection = {};
        if (fields.projection) {
            Object.keys(fields.projection).forEach(key => {
                if (fields.projection[key] === 1) {
                    projection[key] = 1;
                }
            });
        }

        const result = await ApiService.read(fields.masterdata, {
            pagination: {
                page: 1,
                limit: Number.MAX_SAFE_INTEGER
            },
            sort: {},
            filters: { ...staticfilter },
            projection: projection,
        })

        if (result.status === 200) {
            console.log('### result.data', result.data);
            const data = result.data.map(item => ({
                label: printSelectPicker(item, fields),
                value: item.id
            }));

            const masterdata = {
                [fields.masterdata]: data
            }

            const masterdatalist = {
                [fields.masterdata]: result.data
            }

            console.log('### masterdata', masterdata, '### masterdatalist', masterdatalist);
            setProps({ masterdatalist: masterdatalist, masterdata: masterdata })
        }
        else {
            IISMethods.errormsg(result.message || Config.dataaddedfailed, 1)
        }
    }

    const setFormData = async (id) => {
        if (id) {
            const data = IISMethods.getObjectfromArray(getCurrentState().data, 'id', id)
            setProps({ formdata: IISMethods.getcopy(data) })
        }
        else {
            const currentState = getCurrentState();
            const formData = { ...currentState.formdata };

            currentState.rightsidebarformdata?.map(item => {
                if (item.fields && Array.isArray(item.fields)) {
                    item.fields.forEach(fields => {
                        if (fields.type === 'checkbox') {
                            formData[fields.field] = fields.defaultvalue ? 1 : 0;
                        }
                        else {
                            formData[fields.field] = fields.defaultvalue;
                        }
                    })
                }
            })

            setProps({ formdata: IISMethods.getcopy(formData) })
        }

        getCurrentState().rightsidebarformdata?.map(item => {
            if (item.fields && Array.isArray(item.fields)) {
                item.fields.forEach(fields => {
                    if (fields.type === 'dropdown' || fields.type === 'checkpicker') {
                        if (fields.masterdata && !fields.masterdataarray) {
                            getMasterData(1, fields);
                        }
                    }
                })
            }
        })

        IISMethods.handleGrid(true, 'rightsidebar', 1)
    }

    const handleAddButtonClick = () => {
        const validateForm = JsCall.ValidateForm(getCurrentState().formdata, rightSidebarData)
        if (validateForm.hasErrors && Object.keys(validateForm.errors).length > 1) {
            IISMethods.errormsg(Config.fillallfieldserror, 1)
        }
        else if (validateForm.hasErrors && Object.keys(validateForm.errors).length === 1) {
            IISMethods.errormsg(Object.values(validateForm.errors)[0], 1)
        }
        else {
            rightSidebarData.forEach(item => {
                if (item.fields && Array.isArray(item.fields)) {
                    item.fields.forEach(field => {
                        const element = document.getElementById(`form-${field.field}`);

                        if (!element) {
                            if (field.type === 'checkbox') {
                                getCurrentState().formdata[field.field] = 0;
                            }
                            else {
                                getCurrentState().formdata[field.field] = ''
                            }
                        }
                    })
                }
            })

            setProps({ formdata: IISMethods.getcopy(getCurrentState().formdata) })
            if (getCurrentState().formdata.id) {
                updateData(getCurrentState().formdata.id, getCurrentState().formdata)
            }
            else {
                addData(getCurrentState().formdata)
            }
        }
    }

    const handleFormData = (type, key, value) => {
        const currentState = getCurrentState();
        const formData = { ...currentState.formdata };
        if (type === 'checkbox') {
            formData[key] = value ? 1 : 0;
        }
        else if (type === 'dropdown') {
            const fieldObj = IISMethods.getObjectfromArray(rightSidebarData[0].fields, 'field', key)
            if (key === 'stockid') {
                formData[fieldObj.field] = value || '';
                formData[fieldObj.formdatafield] = IISMethods.getObjectfromArray(getCurrentState().masterdata[fieldObj.masterdata], 'value', value)?.label || '';
                formData['symbol'] = IISMethods.getObjectfromArray(getCurrentState().masterdatalist[fieldObj.masterdata], 'id', value)?.stockcode || '';
            }
            else {
                formData[fieldObj.field] = value || '';
                formData[fieldObj.formdatafield] = IISMethods.getObjectfromArray(getCurrentState().masterdata[fieldObj.masterdata], 'value', value)?.label || '';
            }

        }
        else if (type === 'checkpicker') {
            const fieldObj = IISMethods.getObjectfromArray(rightSidebarData[0].fields, 'field', key);

            const finalArray = value?.map(val => {
                return {
                    [fieldObj.formdatafield + 'id']: val || '',
                    [fieldObj.formdatafield]: IISMethods.getObjectfromArray(getCurrentState().masterdata[fieldObj.masterdata], 'value', val)?.label || ''
                }
            })

            formData[fieldObj.formdatafield] = finalArray;
        }
        else {
            formData[key] = value;
        }

        setProps({ formdata: IISMethods.getcopy(formData) })

        const newRightSidebarFormData = IISMethods.createRightSidebarData(key, rightSidebarData)
        const newFormData = IISMethods.createFormData(key, value)
        JsCall.ValidateForm(newFormData, newRightSidebarFormData)
    }

    const updateData = async (id, formData) => {
        try {
            const responseData = await ApiService.update(
                getCurrentState().rightsidebarformdata?.[0]?.aliasname,
                id,
                formData
            );

            if (responseData.status === 200) {
                IISMethods.successmsg(Config.dataupdated, 2);
                IISMethods.handleGrid(false, 'rightsidebar', 0)
                getlist();
            } else {
                IISMethods.errormsg(responseData.message || Config.dataaddedfailed, 1);
            }

        } catch (error) {
            console.error(`Error updating ${getCurrentState().rightsidebarformdata?.[0]?.aliasname}:`, error);
            IISMethods.errormsg('Failed to update record', 1);
        }
    }

    const addData = async (reqData) => {
        try {
            console.log('reqData', reqData);
            const responseData = await ApiService.create(
                getCurrentState().rightsidebarformdata?.[0]?.aliasname,
                reqData
            );

            if (responseData.status === 200) {
                IISMethods.successmsg(Config.dataaddedsuccessfully, 1)
                IISMethods.handleGrid(false, 'rightsidebar', 0)
                getlist()
            }
            else {
                IISMethods.errormsg(responseData.message || Config.dataaddedfailed, 1)
            }

        } catch (error) {
            console.error(`Error adding ${getCurrentState().rightsidebarformdata?.[0]?.aliasname}:`, error);
            IISMethods.errormsg('Failed to add record', 1);
        }
    }

    const getlist = async () => {
        try {
            const currentState = getCurrentState();
            const aliasname = currentState.rightsidebarformdata?.[0]?.aliasname;

            // ✅ Check if aliasname exists before making API call
            if (!aliasname) {
                console.warn('⚠️ No aliasname found, skipping API call');
                return;
            }

            console.log('🔍 Fetching list for:', aliasname);

            let filter = IISMethods.getcopy(currentState.filterdata) || {};
            let sortData = getSortData();

            const searchTerm = filter?.searchbar || '';

            if (filter.hasOwnProperty('searchbar')) {
                delete filter.searchbar;
            }

            Object.keys(filter).forEach(key => {
                if (filter[key] === '' || filter[key] === null || filter[key] === undefined) {
                    delete filter[key];
                }
            })

            setProps({ loading: true });

            const result = await ApiService.read(aliasname, {
                pagination: {
                    page: currentState.pageno,
                    limit: currentState.pagelimit
                },
                sort: sortData,
                filters: filter,
                search: searchTerm
            });

            console.log('📦 API Result:', result);

            if (result && result.data) {
                setProps({
                    data: result.data,
                    totalcount: result.totalCount || 0,
                    nextpage: result.nextPage || 0,
                    loading: false
                })
                console.log('✅ Data loaded successfully:', result.data.length, 'records');
            } else {
                setProps({
                    data: [],
                    totalcount: 0,
                    nextpage: 0,
                    loading: false
                })
                console.log('⚠️ No data returned');
            }

        } catch (error) {
            console.error(`❌ Error loading ${getCurrentState().rightsidebarformdata?.[0]?.aliasname}:`, error);

            setProps({
                data: [],
                totalcount: 0,
                nextpage: 0,
                loading: false,
                error: error.message || `Failed to load ${getCurrentState().rightsidebarformdata?.[0]?.aliasname}`
            });

            IISMethods.errormsg(`Failed to load data. Please try again.`, 1);
        }
    }

    const handlePageChange = (newPage) => {
        setProps({ pageno: newPage });
        getlist();
    }

    const handlePageSizeChange = (newPageSize) => {
        setProps({
            pagelimit: newPageSize,
            pageno: 1
        });
        getlist();
    }

    const handleFilterChange = (newFilters) => {
        setProps({
            filterdata: newFilters,
            pageno: 1
        });
        getlist();
    }

    const handleSortChange = (field, order) => {
        setProps({
            sortdata: { field, order },
            pageno: 1
        });
        getlist();
    }

    const handleDeleteData = async (id) => {
        try {
            console.log('id', id)
            const result = await ApiService.delete(
                getCurrentState().rightsidebarformdata?.[0]?.aliasname,
                id
            )
            if (result.status === 200) {
                IISMethods.successmsg(Config.datadeleted, 1)
                IISMethods.handleGrid(false, 'deletemodal', 0)
                getlist();
            }
            else {
                IISMethods.errormsg(result.message || Config.dataaddedfailed, 1)
            }
        } catch (error) {
            console.error(`Error deleting ${getCurrentState().rightsidebarformdata?.[0]?.aliasname}:`, error);
            IISMethods.errormsg('Failed to delete record', 1);
        }
    }

    const handleSearch = (searchTerm) => {
        setProps({
            filterdata: { ...getCurrentState().filterdata, searchbar: searchTerm },
            pageno: 1
        })

        setProps({ oldfilterdata: { ...getCurrentState().filterdata, searchbar: searchTerm } })
        getlist()
    }

    try {
        return (
            <>
                <div>
                    <MasterView
                        setFormData={setFormData}
                        handleAddButtonClick={handleAddButtonClick}
                        handleFormData={handleFormData}
                        handlePageChange={handlePageChange}
                        handlePageSizeChange={handlePageSizeChange}
                        handleFilterChange={handleFilterChange}
                        handleSortChange={handleSortChange}
                        getlist={getlist}
                        handleDeleteData={handleDeleteData}
                        handleSearch={handleSearch}
                        updateData={updateData}
                    />
                </div>
            </>
        );
    }
    catch (e) {
        console.log('error', e);
        return <></>;
    }
};

export default StockHistoryController;