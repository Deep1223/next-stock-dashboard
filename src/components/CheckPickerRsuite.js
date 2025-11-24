'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CheckPicker } from 'rsuite';

const CheckPickerRsuite = (props) => {
    const [internalValue, setInternalValue] = useState([]); // For CheckPicker display (includes __ALL__)
    
    // Add "All" option to the data at the end
    const dataWithAll = useMemo(() => {
        if (!props.data || !props.showAllOption) return props.data;
        
        const allOption = {
            label: props.allOptionLabel || 'All',
            value: '__ALL__',
            role: 'Master'
        };
        
        return [...props.data, allOption];
    }, [props.data, props.showAllOption, props.allOptionLabel]);

    // Get all values except the __ALL__ option
    const getAllDataValues = () => {
        return props.data?.map(item => item.value) || [];
    };

    // Sync internalValue with props.value
    useEffect(() => {
        const currentValue = props.value || [];
        const allValues = getAllDataValues();
        
        // If all items are selected, add __ALL__ to internal value for display
        if (currentValue.length === allValues.length && allValues.length > 0) {
            setInternalValue(['__ALL__', ...currentValue]);
        } else {
            setInternalValue(currentValue);
        }
    }, [props.value, props.data]);

    const handleChange = (value) => {
        const allValues = getAllDataValues();
        const clickedAll = value.includes('__ALL__');
        const wasAllChecked = internalValue.includes('__ALL__');

        let newActualValue; // Value to send to parent (without __ALL__)
        let newInternalValue; // Value for CheckPicker display (with __ALL__ if needed)

        // CASE 1: User clicked "All" checkbox
        if (clickedAll && !wasAllChecked) {
            // All was unchecked, now checked - select all items
            console.log('CASE 1: All checkbox clicked - selecting all');
            newActualValue = [...allValues];
            newInternalValue = ['__ALL__', ...allValues];
        } 
        // CASE 2: User clicked "All" checkbox again (to uncheck it)
        else if (!clickedAll && wasAllChecked) {
            // Check if only "All" was unchecked or if individual items were unchecked
            const remainingItems = value.filter(v => v !== '__ALL__');
            
            if (remainingItems.length === allValues.length) {
                // Only "All" was unchecked (all items still selected) - uncheck everything
                console.log('CASE 2: All checkbox unchecked - deselecting all');
                newActualValue = [];
                newInternalValue = [];
            } else {
                // Some individual item was unchecked - keep remaining items
                console.log('CASE 3: Individual item unchecked while All was checked');
                newActualValue = remainingItems;
                newInternalValue = remainingItems;
            }
        }
        // CASE 4: User manually selected/deselected items
        else if (!clickedAll && !wasAllChecked) {
            const selectedItems = value.filter(v => v !== '__ALL__');
            
            // Check if all items are now selected
            if (selectedItems.length === allValues.length && allValues.length > 0) {
                console.log('CASE 4: All items manually selected - checking All');
                newActualValue = [...allValues];
                newInternalValue = ['__ALL__', ...allValues];
            } else {
                console.log('CASE 5: Normal selection/deselection');
                newActualValue = selectedItems;
                newInternalValue = selectedItems;
            }
        }
        // CASE 6: Edge case - fallback
        else {
            console.log('CASE 6: Fallback case');
            const selectedItems = value.filter(v => v !== '__ALL__');
            newActualValue = selectedItems;
            newInternalValue = selectedItems;
        }

        console.log('Internal Value:', newInternalValue);
        console.log('Actual Value (to parent):', newActualValue);

        setInternalValue(newInternalValue);
        
        if (props.onChange) {
            props.onChange(newActualValue);
        }
    };

    return (
        <CheckPicker
            data={dataWithAll}
            searchable={props.searchable}
            placeholder={props.placeholder}
            value={internalValue}
            onChange={handleChange}
            disabled={props.disabled}
            id={props.id}
            name={props.name}
            className={`${props.className} checkpicker-with-all stock-picker`}
            renderValue={(value, items) => {
                const displayItems = items.filter(item => item.value !== '__ALL__');
                if (displayItems.length === 0) {
                    return props.placeholder || 'Select';
                }
                return displayItems.map(item => item.label).join(', ');
            }}
        />
    );
};

export default CheckPickerRsuite;