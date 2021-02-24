import React from 'react';
import { Box, Stack, Radio } from '@chakra-ui/react';

export default function MultipleChoiceResponseSingleAnswer(props) {
    const { options, choice, update, ...chakraProps } = props;

    return (
        <Box as="section" {...chakraProps}>
                <Stack spacing={3}>
                    {options.map(option => (
                        <Radio
                            key={option.id}
                            value={option.id}
                            isChecked={choice == option.id}
                            onChange={e => update(e.target.value)}
                            spacing="1rem"
                            size="lg"
                        >
                            {option.text}
                        </Radio>
                    ))}
                </Stack>
        </Box>
    );
}
