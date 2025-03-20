import { Placeholder } from "rsuite";

const getCurrentDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `Leads Imported On ${day}/${month}/${year} ${hours}:${minutes}`;
};

const MasterJson = {
    // leads management
    leads: [
        {
            pagename: "Lead",
            tabname: "Import Csv File",
            fields: [
                {
                    field: "lead",
                    text: "Leads",
                    type: "file",
                    size: "w-full",
                    required: true,
                    accept: ".csv,.xlsx",
                },
            ],
        },
        {
            tabname: "Map Fields",
            fields: [
                {
                    field: "email_id",
                    text: "Email Id",
                    type: "select",
                    options: [
                        { label: "Email Id", value: "550e8400e29b41" },
                        { label: "Work Email", value: "a71644665544" },
                        { label: "Personal Email", value: "0000e29b41d4a7" }
                    ],
                    required: true,
                    searchable: true,
                    Placeholder: "Select Email Id",
                    clearable: true,
                },
                {
                    field: "lead_source",
                    text: "Lead Source",
                    type: "select",
                    options: [
                        { label: "Lead Source", value: "b29f87a1cde45" },
                        { label: "Referral", value: "cde45761b29f8" },
                        { label: "Advertisement", value: "761b29f87a1cd" },
                        { label: "Social Media", value: "a1cde45761b29" }
                    ],
                    required: true,
                    searchable: true,
                    Placeholder: "Select Lead Source",
                    clearable: true,
                },
                {
                    field: "name",
                    text: "Name",
                    type: "select",
                    options: [
                        { label: "First Name", value: "5f87b1cde45a7" },
                        { label: "Full Name", value: "a76cde45f87b1c" },
                        { label: "Last Name", value: "de45f87b1a76cd" }
                    ],
                    required: true,
                    searchable: true,
                    Placeholder: "Select Name",
                    clearable: true,
                },
                {
                    field: "owner",
                    text: "Owner",
                    type: "select",
                    options: [
                        { label: "Owner", value: "6b1cde457f87a1" },
                        { label: "Manager", value: "cde45f876b1a7f" },
                        { label: "Admin", value: "a1cde457f87b6b" }
                    ],
                    required: true,
                    searchable: true,
                    Placeholder: "Select Owner",
                    clearable: true,
                },
                {
                    field: "phone_number",
                    text: "Phone Number",
                    type: "select",
                    options: [
                        { label: "Phone Number", value: "b1cde457f87a1c" },
                        { label: "Mobile Number", value: "de45f87a1cde45" },
                        { label: "Work Number", value: "7f87b1cde45a76" }
                    ],
                    required: true,
                    searchable: true,
                    Placeholder: "Select Phone Number",
                    clearable: true,
                }
            ]
        },
        {
            tabname: "Actions",
            fields: [
                {
                    field: "leadimportrules",
                    text: 'Lead import rules',
                    type: "title",
                    size: "w-full",
                },
                {
                    field: "handlingduplicateleadrecords",
                    text: "Handling Duplicate Lead Records",
                    type: "radio",
                    size: "w-full",
                    options: [
                        { label: "Ignore duplicates", value: "u2mrab0x" },
                        { label: "Overwrite duplicates", value: "v0dnah8f" },
                        { label: "Update empty fields of duplicates", value: "ye6rw1a2" },
                    ],
                    required: true,
                },
                {
                    field: "mandatory",
                    text: "Mandatory",
                    type: "checkbox",
                    size: "w-full",
                    required: true,
                    showIf: { field: "handlingduplicateleadrecords", values: ["u2mrab0x", "ye6rw1a2", "v0dnah8f"] },
                    options: [
                        {
                            label: "Import Only if Valid Phone Number exists in CSV",
                            value: "5f6w79qnl2zbxa",
                            showIf: { field: "handlingduplicateleadrecords", values: ["u2mrab0x", "ye6rw1a2", "v0dnah8f"] }
                        },
                        {
                            label: "Do not update owner of existing leads",
                            value: "4tqwiuxkgvcod9",
                            showIf: { field: "handlingduplicateleadrecords", values: ["v0dnah8f"] }
                        },
                        {
                            label: "Do not create new leads",
                            value: "5c3t8vqrxemnbg",
                            showIf: { field: "handlingduplicateleadrecords", values: ["v0dnah8f"] }
                        }
                    ]
                },

                {
                    field: "selectlistandowner",
                    text: 'Select List and Owner',
                    type: "title",
                    size: "w-full",
                    spacingtop: 'mt-5',
                },
                {
                    field: "leadowner",
                    text: "Lead Owner",
                    size: "w-full",
                    type: "select",
                    options: [
                        { label: "Admin", value: "1gsiltkr" },
                        { label: "Gaurav Patinge", value: "a84nitbg" },
                        { label: "Ketan Koli", value: "5avw6fh7" },
                        { label: "Kiran Kumar", value: "dklm5ihb" },
                        { label: "Krishna Sharma", value: "5qx1knaf" },
                        { label: "Parth Gore", value: "0h38baqv" },
                        { label: "Rajat Mangal", value: "qgpwr671" },
                        { label: "Ritesh Vanare", value: "c5gbzw09" },
                        { label: "Riya Shaw", value: "ilvuxekc" },
                        { label: "System", value: "v9q6al7o" },
                        { label: "Yash Deshmukh", value: "goiryz5k" },
                    ],
                    required: true,
                    searchable: true,
                    Placeholder: "Select Lead Owner",
                    clearable: true,
                },
                {
                    field: "addtolist",
                    text: "Add To List",
                    type: "radio",
                    size: "w-full",
                    options: [
                        { label: "New List", value: "u5rxilaejm40oz" },
                        { label: "Existing List", value: "xp13sh5lzgnqa8" },
                        { label: "None", value: "xaikg8c40w3ynh" },
                    ],
                    required: true,
                },
                {
                    field: 'listname',
                    text: "List Name",
                    type: "text",
                    size: "w-full",
                    required: true,
                    showIf: { field: "addtolist", values: ["u5rxilaejm40oz"] },
                    placeholder: "Enter List Name",
                },
                {
                    field: 'listdescription',
                    text: "List Description",
                    type: "textarea",
                    size: "w-full",
                    required: true,
                    showIf: { field: "addtolist", values: ["u5rxilaejm40oz"] },
                    placeholder: "Enter List Description",
                },
                {
                    field: 'listname',
                    text: "List Name",
                    type: "select",
                    size: "w-full",
                    required: true,
                    options: [
                        { label: "The complete course on Fundamental Analysis (Analyse any stock in less than 3 hrs)", value: "m07yosiahnxw8f" },
                        { label: "The complete course on Indian stock market: The most practical guide 2023", value: "7hjpt8sergzyoc" },
                        { label: "The Complete Course On Options Trading By Convey", value: "4vd65qjwkem0hi" },
                        { label: "The Complete Fundamental Analysis Course in Hindi", value: "374bfp2ruteaz8" },
                        { label: "The Foundation Course on Indian Stock Market For Beginners", value: "8ym3sj6xc1ol7i" }
                    ],
                    showIf: { field: "addtolist", values: ["xp13sh5lzgnqa8"] },
                    placeholder: "Select List Name",
                    searchable: true,
                },

                {
                    field: "selectsource",
                    text: 'Select Source',
                    type: "title",
                    size: "w-full",
                    spacingtop: 'mt-5',
                },
                {
                    field: "leadsource",
                    text: "Lead Source",
                    size: "w-full",
                    type: "text",
                    required: false,
                    defaultValue: "Already selected in mapped fields",
                    disabled: true,
                    Placeholder: 'Enter Lead Source',
                },
                {
                    field: "importsummarynote",
                    text: "Import Summary Note",
                    type: "text",
                    size: "w-full",
                    defaultValue: getCurrentDateTime(),
                    required: true,
                    Placeholder: 'Enter Import Summary Note',
                },
            ],
        },
        {
            tabname: "Summary",
            fields: [
                {
                    field: "text",
                    text: "Text",
                    type: "text",
                    size: "w-full",
                    required: true,
                    placeholder: "Enter Text",
                },
            ],
        },
    ],

    // Fields Management
    field: [
        {
            pagename: "Field",
            fields: [
                {
                    "field": "displayname",
                    "text": "Display Name",
                    "type": "text",
                    "size": "w-full",
                    "required": true,
                    "placeholder": "Enter Display Name",
                }
            ]
        }
    ],
};

export default MasterJson;
