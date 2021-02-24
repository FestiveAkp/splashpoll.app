import React from 'react';
import { Box, Stack, CheckboxGroup, Checkbox } from '@chakra-ui/react';

export default function MultipleChoiceResponseMultipleAnswer(props) {
    const { options, choices, update, ...chakraProps } = props;

    return (
        <Box as="section" {...chakraProps}>
            <CheckboxGroup onChange={update} value={choices}>
                <Stack spacing={3}>
                    {options.map(option => (
                        <Checkbox
                            key={option.id}
                            value={option.id.toString()}
                            spacing="1rem"
                            size="lg"
                        >
                            {option.text}
                        </Checkbox>
                    ))}
                </Stack>
            </CheckboxGroup>
        </Box>
    );
}
