import React from 'react';
import { Box, Stack, Radio } from '@chakra-ui/react';

export default function MultipleChoiceResponseSingleAnswer(props) {
    const { options, choice, update, ...chakraProps } = props;

    return (
        <Box as="section" {...chakraProps}>
                <Stack spacing={3}>
                    {options.map((option, i) => (
                        <Radio
                            key={i}
                            value={option}
                            isChecked={choice === option}
                            onChange={e => update(e.target.value)}
                            spacing="1rem"
                            size="lg"
                        >
                            {option}
                        </Radio>
                    ))}
                </Stack>
        </Box>
    );
}
