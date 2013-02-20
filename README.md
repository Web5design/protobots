#Protobots

##Tips
The following render can be used to pass variables to the called partial.

    <%= render "/partials/block", :locals => { :title => "Past Events" } %>

The partial would then look like the following

    <%
    if !defined? title
      title = "Default Title"
    end
    %>
    <h2><%= title %></h2>
