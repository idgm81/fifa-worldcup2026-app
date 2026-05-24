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
        api_id: string;
        name: string;
        group: string;
        status: 'scheduled' | 'live' | 'finished';
        minute: number;
        home_team: { name: string; image: string };
        away_team: { name: string; image: string };
        score: { home: number; away: number };
        lineups: { home: { startXI: [], coach: string, subs: [] }, away: { startXI: [], coach: string, subs: [] } },
        stats: {
            possession: { home: number; away: number };
            shots: { home: number; away: number };
            corners: { home: number; away: number };
            offsides: { home: number; away: number };
            fouls: { home: number; away: number };
        };
        events: MatchEvent[];
        scheduled_at: string,
        updated_at: string,
        location: {
            name: string;
            city: string; 
        },
        broadcasters: []
    }
}
