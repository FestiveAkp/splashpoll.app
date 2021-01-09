import React, { useState } from 'react';
import { useCombobox } from 'downshift';
import { matchSorter } from 'match-sorter';
import { BsArrowBarDown, BsArrowBarUp } from 'react-icons/bs';
import { Box, Flex, List, ListItem, Text, Input, Icon, IconButton } from '@chakra-ui/react';
import Highlighter from 'react-highlight-words';

export default function OpenEndedResponseSingleChoice(props) {
    const { onSelectedItemChange } = props;
    const [items, setItems] = useState(props.items);        // Gets incoming data + newly created items
    const [inputItems, setInputItems] = useState(items);    // Gets sorted and filtered by input

    const {
        isOpen,
        openMenu,
        getToggleButtonProps,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        highlightedIndex,
        getItemProps,
        selectedItem,
        inputValue
    } = useCombobox({
        id: 'open-ended-single',
        defaultHighlightedIndex: 0,
        items: inputItems,

        onInputValueChange: ({ inputValue }) => {
            // Filter and sort items based on current input
            const filteredItems = matchSorter(items, inputValue);

            // Set filtering, add current text input value as a new option in dropdown
            setInputItems(filteredItems);

            if (inputValue) {
                // Only add it if it's not already in there
                if (!filteredItems.includes(inputValue)) {
                    setInputItems(curr => [...curr, inputValue]);
                }
            }
        },

        onSelectedItemChange,

        stateReducer: (state, actionAndChanges) => {
            const { type, changes } = actionAndChanges;

            switch (type) {
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                    return {
                        ...changes,
                        isOpen: state.isOpen,
                        highlightedIndex: state.highlightedIndex
                    };
                default:
                    return changes;
            }
        },

        onStateChange: ({ type, selectedItem }) => {
            switch (type) {
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                case useCombobox.stateChangeTypes.InputBlur:
                    // Add newly created custom item to dropdown list
                    if (selectedItem && !items.includes(selectedItem)) {
                        // Don't select empty answers
                        if (selectedItem && selectedItem.trim() === '') {
                            return;
                        }
                        setItems(curr => [...curr, selectedItem]);
                    }
                    break;
                default:
                    break;
            }
        },
    });

    return (
        <Box as="section" mt={10} mb={6} position="relative">
            {/* --- Combobox input --- */}
            <Flex {...getComboboxProps()}>
                <Input
                    {...getInputProps({
                        onFocus: () => {
                            if (!isOpen) openMenu();
                        }
                    })}
                    width="80%"
                    placeholder="Start typing your answer..."
                />
                <IconButton
                    {...getToggleButtonProps()}
                    aria-label={'toggle menu'}
                    ml={2}
                    icon={<Icon as={isOpen ? BsArrowBarUp : BsArrowBarDown} />}
                />
            </Flex>
            <Text fontSize="sm" color="grey" mt={2}>Select an answer above or create your own</Text>
            {/* --- Dropdown menu --- */}
            <List
                {...getMenuProps()}
                position="absolute"
                zIndex="1000"
                display={isOpen ? null : 'none'}
                width="100%"
                maxHeight="200px"
                shadow="md"
                backgroundColor="white"
                borderColor="gray.200"
                borderWidth={1}
                borderRadius={3}
                overflowY="auto"
                listStyleType="none"
                mt={1}
            >
                {isOpen &&
                    <>
                        {inputItems.map((item, index) => (
                            <ListItem
                                key={`${item}${index}`}
                                backgroundColor={highlightedIndex === index ? 'blue.100' : 'white'}
                                cursor="default"
                                p={2}
                                borderBottomWidth={index === inputItems.length - 1 ? 0 : 1}
                                {...getItemProps({ item, index })}
                            >
                                {item && item === inputValue && !items.includes(inputValue) ? (
                                    <Flex>
                                        <Text>Create&nbsp;</Text>
                                        <Text as="mark" fontWeight="bold">{item}</Text>
                                    </Flex>
                                ) : (
                                    <Flex align="center">
                                        {selectedItem === item && <Text role="img" aria-label="Selected" mr={2}>✅</Text>}
                                        <Highlighter
                                            autoEscape
                                            searchWords={[inputValue || '']}
                                            textToHighlight={item || ''}
                                        />
                                    </Flex>
                                )}
                            </ListItem>
                        ))}
                    </>
                }
            </List>
        </Box>
    );
}
