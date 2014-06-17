Imports System.Net
Imports System.Web.Http
Imports GA_MI_API.db
Imports Dapper

Public Class ValuesController
    Inherits ApiController

    ' GET api/values
    Public Function GetValues() As List(Of needLine)
        Dim str As List(Of needLine) = getNeedList()
        Return str
    End Function

    ' GET api/values/5
    Public Function GetValue(ByVal id As Integer) As String
        Return "value"
    End Function

    ' POST api/values
    Public Sub PostValue(<FromBody()> ByVal value As String)

    End Sub

    ' PUT api/values/5
    Public Sub PutValue(ByVal id As Integer, <FromBody()> ByVal value As String)

    End Sub

    ' DELETE api/values/5
    Public Sub DeleteValue(ByVal id As Integer)

    End Sub
End Class
