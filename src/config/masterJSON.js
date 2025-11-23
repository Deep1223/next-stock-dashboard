import Config from "./config";

const MasterJson = (type) => {
    switch (type) {
        case 'category':
            return [
                {
                    tabname: 'Category Master',
                    pagename: 'Category',
                    aliasname: 'category',
                    rightsidebarsize: 'sm',
                    fields: [
                        {
                            field: 'categoryname',
                            text: 'Category Name',
                            type: 'text',
                            disabled: false,
                            required: true,
                            defaultvisibility: true,
                            size: 'col-12',
                            placeholder: 'Enter Category Name',
                            defaultvalue: '',

                            showingrid: true,
                            sorting: true,
                            tablesize: 'tbl-w-250p',

                            filter: 1,
                            filtertype: 'text',
                            filterplaceholder: 'Enter Category Name',
                            label: 'Category Name',
                        },
                        {
                            field: 'description',
                            text: 'Description',
                            type: 'textarea',
                            disabled: false,
                            required: true,
                            defaultvisibility: true,
                            size: 'col-12',
                            placeholder: 'Enter Description',
                            defaultvalue: '',

                            showingrid: true,
                            sorting: false,
                            tablesize: 'tbl-w-250p',

                            filter: 0,
                        },
                        {
                            field: 'status',
                            text: 'Status',
                            type: 'checkbox',
                            disabled: false,
                            required: false,
                            defaultvisibility: true,
                            size: 'col-12',
                            placeholder: 'Select Status',
                            defaultvalue: 1,

                            showingrid: true,
                            sorting: false,
                            tablesize: 'tbl-w-250p',

                            filter: 0,
                        }
                    ]
                }
            ];
            break;

        case 'researchstudy':
            return [
                {
                    tabname: 'Research Study Master',
                    pagename: 'Research Study',
                    aliasname: 'researchstudy',
                    rightsidebarsize: 'md',
                    fields: [
                        {
                            field: 'title',
                            text: 'Title',
                            type: 'text',
                            disabled: false,
                            required: true,
                            defaultvisibility: true,
                            size: 'col-6',
                            placeholder: 'Enter Title',
                            defaultvalue: '',

                            showingrid: true,
                            sorting: true,
                            tablesize: 'tbl-w-250p',

                            filter: 1,
                            filtertype: 'text',
                            filterplaceholder: 'Enter Title',
                            label: 'Title',
                        },
                        {
                            field: 'ayushcategoryid',
                            text: 'AYUSH Category',
                            type: 'dropdown',
                            disabled: false,
                            required: true,
                            defaultvisibility: true,
                            size: 'col-6',
                            placeholder: 'Select AYUSH Category',
                            defaultvalue: '',
                            masterdata: 'category',
                            masterdatafield: 'categoryname',
                            formdatafield: 'ayushcategory',
                            cleanable: true,
                            searchable: true,
                            staticfilter: {
                                status: 1
                            },
                            projection: {
                                id: 1,
                                categoryname: 1,
                            },

                            showingrid: true,
                            sorting: true,
                            tablesize: 'tbl-w-250p',

                            filter: 0,
                        },
                        {
                            field: 'researchtypeid',
                            text: 'Research Type',
                            type: 'dropdown',
                            disabled: false,
                            required: true,
                            defaultvisibility: true,
                            size: 'col-6',
                            placeholder: 'Select Research Type',
                            defaultvalue: '',
                            masterdata: 'researchtype',
                            masterdatafield: 'researchtypename',
                            formdatafield: 'researchtype',
                            cleanable: true,
                            searchable: true,
                            staticfilter: {
                                status: 1
                            },
                            projection: {
                                id: 1,
                                researchtypename: 1,
                            },

                            showingrid: true,
                            sorting: true,
                            tablesize: 'tbl-w-250p',

                            filter: 0,
                        },
                        {
                            field: 'abstract',
                            text: 'Abstract',
                            type: 'textarea',
                            disabled: false,
                            required: true,
                            defaultvisibility: true,
                            size: 'col-12',
                            placeholder: 'Enter Abstract',
                            defaultvalue: '',

                            showingrid: true,
                            sorting: false,
                            tablesize: 'tbl-w-250p',

                            filter: 0,
                        },
                        {
                            field: 'detailedsummary',
                            text: 'Detailed Summary',
                            type: 'html-editor',
                            disabled: false,
                            required: true,
                            defaultvisibility: true,
                            size: 'col-12',
                            placeholder: 'Enter Detailed Summary',
                            defaultvalue: '',

                            showingrid: true,
                            sorting: false,
                            tablesize: 'tbl-w-250p',

                            filter: 0,
                        },
                        {
                            field: 'institution',
                            text: 'Institution',
                            type: 'text',
                            disabled: false,
                            required: true,
                            defaultvisibility: true,
                            size: 'col-6',
                            placeholder: 'Enter Institution',
                            defaultvalue: '',

                            showingrid: true,
                            sorting: true,
                            tablesize: 'tbl-w-250p',

                            filter: 1,
                            filtertype: 'text',
                            filterplaceholder: 'Enter Institution',
                            label: 'Institution',
                        },
                        {
                            field: 'publicationdate',
                            text: 'Publication Date',
                            type: 'datepicker',
                            disabled: false,
                            required: true,
                            defaultvisibility: true,
                            size: 'col-6',
                            placeholder: 'Select Publication Date',
                            defaultvalue: '',
                            cleanable: true,

                            showingrid: true,
                            sorting: true,
                            tablesize: 'tbl-w-250p',

                            filter: 1,
                            filtertype: 'datepicker',
                            filterplaceholder: 'Select Publication Date',
                            label: 'Publication Date',
                        },
                        {
                            field: 'languageid',
                            text: 'Language',
                            type: 'dropdown',
                            disabled: false,
                            required: true,
                            defaultvisibility: true,
                            size: 'col-6',
                            placeholder: 'Select Language',
                            defaultvalue: '',
                            masterdata: 'language',
                            masterdataarray: Config.language,
                            formdatafield: 'language',
                            cleanable: true,
                            searchable: true,
                            staticfilter: {
                                status: 1
                            },
                            projection: {
                                id: 1,
                                languagename: 1,
                            },

                            showingrid: true,
                            sorting: true,
                            tablesize: 'tbl-w-250p',

                            filter: 0,
                        },

                    ]
                }
            ];
            break;

        case 'researchtype':
            return [
                {
                    tabname: 'Research Type Master',
                    pagename: 'Research Type',
                    aliasname: 'researchtype',
                    rightsidebarsize: 'sm',
                    fields: [
                        {
                            field: 'researchtypename',
                            text: 'Research Type Name',
                            type: 'text',
                            disabled: false,
                            required: true,
                            defaultvisibility: true,
                            size: 'col-12',
                            placeholder: 'Enter Research Type Name',
                            defaultvalue: '',

                            showingrid: true,
                            sorting: true,
                            tablesize: 'tbl-w-250p',

                            filter: 1,
                            filtertype: 'text',
                            filterplaceholder: 'Enter Research Type Name',
                            label: 'Research Type Name',
                        },
                        {
                            field: 'status',
                            text: 'Status',
                            type: 'checkbox',
                            disabled: false,
                            required: false,
                            defaultvisibility: true,
                            size: 'col-12',
                            placeholder: 'Select Status',
                            defaultvalue: 1,

                            showingrid: true,
                            sorting: false,
                            tablesize: 'tbl-w-250p',

                            filter: 0,
                        }
                    ]
                }
            ];
            break;

        case 'stockmaster':
            return [
                {
                    tabname: 'Stock Master',
                    pagename: 'Stock Master',
                    aliasname: 'stockmaster',
                    rightsidebarsize: 'sm',
                    fields: [
                        {
                            field: 'stockname',
                            text: 'Stock Name',
                            type: 'text',
                            disabled: false,
                            required: true,
                            defaultvisibility: true,
                            size: 'col-12',
                            placeholder: 'Enter Stock Name',
                            defaultvalue: '',

                            showingrid: true,
                            sorting: true,
                            tablesize: 'tbl-w-250p',

                            filter: 1,
                            filtertype: 'text',
                            filterplaceholder: 'Enter Stock Name',
                            label: 'Stock Name',
                        },
                        {
                            field: 'stockcode',
                            text: 'Stock Code',
                            type: 'text',
                            disabled: false,
                            required: true,
                            defaultvisibility: true,
                            size: 'col-12',
                            placeholder: 'Enter Stock Code',
                            defaultvalue: '',

                            showingrid: true,
                            sorting: true,
                            tablesize: 'tbl-w-250p',

                            filter: 1,
                            filtertype: 'text',
                            filterplaceholder: 'Enter Stock Code',
                            label: 'Stock Code',
                        },
                        {
                            field: 'status',
                            text: 'Status',
                            type: 'checkbox',
                            disabled: false,
                            required: false,
                            defaultvisibility: true,
                            size: 'col-12',
                            placeholder: 'Select Status',
                            defaultvalue: 1,

                            showingrid: true,
                            sorting: false,
                            tablesize: 'tbl-w-250p',

                            filter: 0,
                        }
                    ]
                }
            ];
            break;

        default:
            return [];
    }
};

export default MasterJson;
