import React from 'react';
import { Box, Stack, CheckboxGroup, Checkbox } from '@chakra-ui/react';

export default function MultipleChoiceResponseMultipleAnswer(props) {
    const { options, choices, update, ...chakraProps } = props;

    return (
        <Box as="section" {...chakraProps}>
            <CheckboxGroup onChange={update} value={choices}>
                <Stack spacing={3}>
                    {options.map((option, i) => (
                        <Checkbox key={i} value={`${option}`} spacing="1rem" size="lg">{option}</Checkbox>
                    ))}
                </Stack>
            </CheckboxGroup>
        </Box>
    );
}
