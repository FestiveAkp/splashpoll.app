// https://codesandbox.io/s/funny-shirley-127y7?file=/src/downshift/ordered-examples/05-multi-create.js
import React, { useState } from 'react';
import { matchSorter } from 'match-sorter';
import { useCombobox, useMultipleSelection } from 'downshift';
import Highlighter from 'react-highlight-words';
import { Box, Flex, Icon, IconButton, Input, Kbd, List, ListItem, Tag, TagCloseButton, TagLabel, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { BsArrowBarDown, BsArrowBarUp } from 'react-icons/bs';

export default function OpenEndedResponseMultipleChoice(props) {
    const { items: _, selectedItems, onSelectedItemsChange, ...chakraProps } = props;
    const [items, setItems] = useState(props.items);        // Gets incoming data + newly created items
    const [inputItems, setInputItems] = useState(items);    // Gets sorted and filtered by input

    const {
        getSelectedItemProps,
        getDropdownProps,
        addSelectedItem,
        removeSelectedItem
    } = useMultipleSelection({
        selectedItems,
        onSelectedItemsChange
    });

    const {
        isOpen,
        openMenu,
        getToggleButtonProps,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        highlightedIndex,
        getItemProps,
        inputValue
    } = useCombobox({
        id: 'open-ended-multi',
        selectedItem: null,
        defaultHighlightedIndex: 0,
        items: inputItems,

        onInputValueChange: ({ inputValue }) => {
            // Filter and sort items based on current input
            const filteredItems = matchSorter(items, inputValue)

            // Set filtering, add current text input value as a new option
            setInputItems(filteredItems);

            if (inputValue) {
                // Only add it if it's not already in there
                if (!filteredItems.includes(inputValue)) {
                    setInputItems(curr => [...curr, inputValue]);
                }
            }
        },

        stateReducer: (state, actionAndChanges) => {
            const { changes, type } = actionAndChanges;
            switch (type) {
                case useCombobox.stateChangeTypes.InputBlur:
                    return {
                        ...changes,
                        inputValue: '',
                    };
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                    return {
                        ...changes,
                        isOpen: false,
                        inputValue: '',
                    };
                default:
                    return changes;
            }
        },

        onStateChange: ({ inputValue, type, selectedItem }) => {
            switch (type) {
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                case useCombobox.stateChangeTypes.InputBlur:
                    // Check if item hasn't been selected already
                    if (selectedItem && !selectedItems.includes(selectedItem)) {
                        // Don't select empty answers
                        if (selectedItem && selectedItem.trim() === '') {
                            return;
                        }

                        // Add to multiselect
                        addSelectedItem(selectedItem);

                        // Add custom item to dropdown list
                        if (!items.includes(selectedItem)) {
                            setItems(curr => [...curr, selectedItem]);
                        }
                    }
                    break;
                default:
                    break;
            }
        },
    });

    return (
        <Box as="section" position="relative" {...chakraProps}>
            <div>
                {/* --- Combobox input --- */}
                <Flex {...getComboboxProps()} width="90%">
                    <Input
                        {...getInputProps(getDropdownProps({
                                onFocus: () => {
                                    if (!isOpen) openMenu();
                                }
                            }
                        ))}
                        placeholder="Start typing your answer..."
                    />
                    <IconButton
                        {...getToggleButtonProps()}
                        aria-label={'toggle menu'}
                        ml={2}
                        icon={<Icon as={isOpen ? BsArrowBarUp : BsArrowBarDown} />}
                    />
                </Flex>
                <Text fontSize="sm" color="gray.600" mt={2}>Press enter to add multiple answers</Text>

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
                                            <Text><Kbd>tap</Kbd> or <Kbd>enter</Kbd> to create&nbsp;</Text>
                                            <Text as="mark" fontWeight="bold">{item}</Text>
                                        </Flex>
                                    ) : (
                                        <Flex align="center">
                                            {selectedItems.includes(item) && <Text role="img" aria-label="Selected" mr={2}>✅</Text>}
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

                {/* --- Selected tags --- */}
                <Wrap mt={7}>
                    {selectedItems.map((selectedItem, index) => (
                        <WrapItem key={`selected-item-${index}`} {...getSelectedItemProps({ selectedItem, index })}>
                            <Tag size="lg">
                                <TagLabel fontSize="sm" lineHeight="1.5">{selectedItem}</TagLabel>
                                <TagCloseButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        removeSelectedItem(selectedItem);
                                    }}
                                    aria-label="Remove small badge"
                                />
                            </Tag>
                        </WrapItem>
                    ))}
                </Wrap>
            </div>
        </Box>
    )
}
