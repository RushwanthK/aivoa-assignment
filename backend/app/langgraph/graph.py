from langgraph.graph import StateGraph
from langgraph.graph import END

from app.langgraph.nodes import ComplaintState
from app.langgraph.nodes import extract_node
from app.langgraph.nodes import risk_node

builder = StateGraph(ComplaintState)

builder.add_node(
    "extract",
    extract_node
)

builder.add_node(
    "risk",
    risk_node
)

builder.set_entry_point(
    "extract"
)

builder.add_edge(
    "extract",
    "risk"
)

builder.add_edge(
    "risk",
    END
)

complaint_graph = builder.compile()