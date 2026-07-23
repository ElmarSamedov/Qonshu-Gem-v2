import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuthStore } from '../store/useAuthStore';
import { HeartHandshake, ShieldCheck, Activity } from 'lucide-react';
import * as d3 from 'd3';

export default function GoodDeedsRegistry() {
  const { user } = useAuthStore();
  const [deeds, setDeeds] = useState<any[]>([]);
  const [view, setView] = useState<'feed' | 'graph'>('feed');
  const [totalDeeds, setTotalDeeds] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!user?.district) return;
    
    // Fetch deeds
    const q = query(
      collection(db, 'good_deeds'),
      where('districtId', '==', user.district),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setDeeds(list);
    });

    // Fetch district stats
    const statsQ = query(
      collection(db, 'district_stats'),
      where('__name__', '==', user.district)
    );
    const unsubStats = onSnapshot(statsQ, (snapshot) => {
      if (!snapshot.empty) {
        setTotalDeeds(snapshot.docs[0].data().totalDeeds || 0);
      }
    });

    return () => {
      unsub();
      unsubStats();
    };
  }, [user]);

  useEffect(() => {
    if (view === 'graph' && deeds.length > 0 && svgRef.current) {
      drawGraph();
    }
  }, [view, deeds]);

  const drawGraph = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;

    const nodesMap = new Map();
    const links: any[] = [];

    deeds.forEach(d => {
      if (!nodesMap.has(d.helperId)) nodesMap.set(d.helperId, { id: d.helperId, group: 1 });
      if (!nodesMap.has(d.recipientId)) nodesMap.set(d.recipientId, { id: d.recipientId, group: 2 });
      links.push({ source: d.helperId, target: d.recipientId });
    });

    const nodes = Array.from(nodesMap.values());

    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Define arrowhead marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#94a3b8")
      .style("stroke", "none");

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", (d: any) => d.group === 1 ? "#fb7185" : "#38bdf8") // Rose for helper, Sky for recipient
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    node.append("title")
      .text((d: any) => "Neighbor " + d.id.substring(0, 4));

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => Math.max(10, Math.min(width - 10, d.x)))
        .attr("cy", (d: any) => Math.max(10, Math.min(height - 10, d.y)));
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-900/20">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-indigo-500" />
              Transparent Registry
            </h3>
            <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 mt-1">
              {totalDeeds} confirmed acts of mutual aid in your district.
            </p>
          </div>
          <div className="flex bg-white/50 dark:bg-black/20 rounded-lg p-1 border border-indigo-100 dark:border-indigo-800">
            <button
              onClick={() => setView('feed')}
              className={"px-3 py-1.5 text-sm font-medium rounded-md transition-colors " + (view === 'feed' ? 'bg-indigo-500 text-white shadow-sm' : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/50')}
            >
              Feed
            </button>
            <button
              onClick={() => setView('graph')}
              className={"px-3 py-1.5 text-sm font-medium rounded-md transition-colors " + (view === 'graph' ? 'bg-indigo-500 text-white shadow-sm' : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/50')}
            >
              Network
            </button>
          </div>
        </CardContent>
      </Card>

      {view === 'feed' ? (
        <div className="space-y-3">
          {deeds.length === 0 ? (
            <div className="text-center py-10 text-slate-500">No confirmed deeds yet. Be the first to help a neighbor!</div>
          ) : (
            deeds.map(deed => (
              <div key={deed.id} className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-black/5 dark:border-white/5 flex items-start gap-4">
                <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full">
                  <HeartHandshake className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    A neighbor helped another neighbor with a <span className="text-indigo-600 dark:text-indigo-400 uppercase text-xs tracking-wider font-bold">{deed.category}</span> request.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {deed.createdAt && typeof deed.createdAt.toDate === 'function' ? new Date(deed.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <Card className="glass-panel overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-black/5 dark:border-white/5 pb-4">
            <CardTitle className="text-sm flex items-center">
              <Activity className="w-4 h-4 mr-2 text-indigo-500" />
              Community Help Network
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Nodes represent neighbors. Arrows point from the helper to the recipient.
            </p>
          </CardHeader>
          <CardContent className="p-0 flex justify-center bg-white dark:bg-slate-900">
            {deeds.length === 0 ? (
              <div className="p-10 text-slate-500 text-sm">Not enough data to draw the network graph.</div>
            ) : (
              <svg ref={svgRef} width="100%" height="400" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet" className="max-w-full" />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
