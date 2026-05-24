export interface MatchEvent {
    event: {
        type: 'goal' | 'card' | 'var' | 'penalty' | 'subst';
        minute: number;
        player: string;
        team: 'home' | 'away';
        detail: string;
    }
}

export interface MatchGame {
    game: {
        id: string;
        name: string;
        group: string;
        status: 'scheduled' | 'live' | 'finished';
        minute: number;
        home_team: { name: string; image: string };
        away_team: { name: string; image: string };
        score: { home: number; away: number };
        stats: {
            possession: { home: number; away: number };
            shots: { home: number; away: number };
            corners: { home: number; away: number };
            offsides: { home: number; away: number };
            fouls: { home: number; away: number };
        };
        events: MatchEvent[];
        scheduled_at: Date,
        updated_at: Date,
        location: {
            name: string;
            city: string; 
        },
        broadcasters: []
    }
}

