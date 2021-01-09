import React from 'react';
import { Box, Stack, RadioGroup, Radio } from '@chakra-ui/react';

export default function MultipleChoiceResponseSingleAnswer(props) {
    const { options, choice, update } = props;

    return (
        <Box as="section" mt={10} mb={8}>
            <RadioGroup onChange={value => update(value)} value={choice}>
                <Stack spacing={3}>
                    {options.map((option, i) => (
                        <Radio key={i} value={option} spacing="1rem" size="lg">{option}</Radio>
                    ))}
                </Stack>
            </RadioGroup>
        </Box>
    );
}
