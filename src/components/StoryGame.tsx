import { useGame } from '@/hooks/useGame';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Inventory } from './Inventory';
import { Skeleton } from './ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

const StoryGame = () => {
    const {
        loading,
        storyError,
        currentNode,
        score,
        inventory,
        gameEnded,
        availableChoices,
        handleChoice,
        restartGame,
    } = useGame();

    if (loading) {
        return (
            <Card className="w-full shadow-lg">
                <CardHeader><CardTitle className="text-center text-2xl font-bold">Adventure Quest</CardTitle></CardHeader>
                <CardContent className="min-h-[250px] p-6 space-y-4">
                    <Skeleton className="h-6 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter className="flex flex-col gap-4 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mx-auto">
                        <Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" />
                    </div>
                </CardFooter>
            </Card>
        );
    }

    if (storyError) {
        return (
            <Card className="w-full shadow-lg">
                <CardHeader><CardTitle className="text-center text-2xl font-bold">Adventure Quest</CardTitle></CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error Loading Story</AlertTitle>
                        <AlertDescription>
                            There was a problem loading the game's data. Please try refreshing the page.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader><CardTitle className="text-center text-2xl font-bold">Adventure Quest</CardTitle></CardHeader>
            <CardContent className="min-h-[250px] p-6 text-lg">
                <p className="whitespace-pre-wrap">{currentNode?.text}</p>
                {!gameEnded && <Inventory items={inventory} />}
                {gameEnded && (
                    <div className="mt-4 text-center">
                        <p className="text-2xl font-semibold">Game Over!</p>
                        <p className="text-xl">Your final score is: {score}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mx-auto">
                    {availableChoices?.map((choice, index) => (
                        <Tooltip key={index} delayDuration={100}>
                            <TooltipTrigger asChild>
                                <div className="w-full">
                                    <Button
                                        onClick={() => handleChoice(choice)}
                                        disabled={choice.disabled}
                                        className="w-full h-full p-4 text-base whitespace-normal transition-transform hover:scale-105"
                                    >
                                        {choice.text}
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            {choice.disabled && (
                                <TooltipContent>
                                    <p>{choice.disabledReason}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    ))}
                </div>
                {!gameEnded && <Button variant="outline" className="mt-4 transition-transform hover:scale-105" onClick={restartGame}>Restart Game</Button>}
            </CardFooter>
        </Card>
    );
};

export default StoryGame;